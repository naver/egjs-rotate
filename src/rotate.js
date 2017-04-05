import {window, document} from "./browser";

export default (() => {
	/**
	 * Tiny custom rotate event binder
	 *
	 * @ko 기기 회전에 따른 rotate 커스텀 이벤트 바인더
	 * @name eg#rotate
	 * @event
	 * @param {Event} e Native event object<ko>네이티브 이벤트 객체</ko>
	 * @param {Object} info The object of data to be sent when the event is fired<ko>이벤트가 발생할 때 전달되는 데이터 객체</ko>
	 * @param {Boolean} info.isVertical The orientation of the device (true: portrait, false: landscape) <ko>기기의 화면 방향(true: 수직 방향, false: 수평 방향)</ko>
	 * @support { "ios" : "7+", "an" : "2.1+ (except 3.x)"}
	 * @example
	 * // bind
	 * eg.rotate.on(function(e, info){
	 *      info.isVertical;
	 * });
	 * // unbind
	 * eg.rotate.off();
	 */
	let beforeScreenWidth = -1;
	let beforeVertical = null;
	const USER_LISTENERS = [];   // user's event listener

	const agent = (() => {
		const ua = window.navigator.userAgent;
		const match = ua.match(/(iPhone OS|CPU OS|Android)\s([^\s;-]+)/);  // fetch Android & iOS env only
		const res = {
			os: "",
			version: ""
		};

		if (match) {
			res.os = match[1].replace(/(?:CPU|iPhone)\sOS/, "ios").toLowerCase();
			res.version = match[2].replace(/\D/g, ".");
		}

		return res;
	})();

	const isMobile = /android|ios/.test(agent.os);

	if (!isMobile) {
		return undefined;
	}

	/**
	 * Return event name string for orientationChange according browser support
	 */
	const ORIENTATION_CHANGE_EVENT = (() => {
		let type;

		/**
		 * Some platform/broswer returns previous widht/height state value. For workaround, give some delays.
		 *
		 * Android bug:
		 * - Andorid 2.3 - Has orientationchange with bug. Needs 500ms delay.
		 *
		 *   Note: Samsung's branded Android 2.3
		 *   When check orientationchange using resize event, could cause browser crash if user binds resize event on window
		 *
		 * - Android 2.2 - orientationchange fires twice(at first time width/height are not updated, but second returns well)
		 * - Lower than 2.2 - use resize event
		 *
		 * InApp bug:
		 * - Set 200ms delay
		 */
		if ((agent.os === "android" && agent.version === "2.1")) {
			type = "resize";
		} else {
			type = "onorientationchange" in window ? "orientationchange" : "resize";
		}

		return type;
	})();

	/**
	 * When viewport orientation is portrait, return true otherwise false
	 */
	function isVertical() {
		let screenWidth;
		let degree;
		let vertical;

		if (ORIENTATION_CHANGE_EVENT === "resize") {
			screenWidth = document.documentElement.clientWidth;

			if (beforeScreenWidth === -1) { // first call isVertical
				vertical = screenWidth < document.documentElement.clientHeight;
			} else {
				if (screenWidth < beforeScreenWidth) {
					vertical = true;
				} else if (screenWidth === beforeScreenWidth) {
					vertical = beforeVertical;
				} else {
					vertical = false;
				}
			}
		} else {
			degree = window.orientation;

			if (degree === 0 || degree === 180) {
				vertical = true;
			} else if (degree === 90 || degree === -90) {
				vertical = false;
			}
		}
		return vertical;
	}

	/**
	 * Trigger rotate event
	 */
	function triggerRotate(e) {
		const currentVertical = isVertical();

		if (isMobile) {
			if (beforeVertical !== currentVertical) {
				beforeVertical = currentVertical;
				beforeScreenWidth = document.documentElement.clientWidth;

				USER_LISTENERS.forEach(v => v(e, {
					isVertical: beforeVertical
				}));
			}
		}
	}

	/**
	 * Trigger event handler
	 */
	function handler(e) {
		let rotateTimer = null;

		if (ORIENTATION_CHANGE_EVENT === "resize") {
			window.setTimeout(() => triggerRotate(e), 0);
		} else {
			if (agent.os === "android") {
				const screenWidth = document.documentElement.clientWidth;

				if (e.type === "orientationchange" && screenWidth === beforeScreenWidth) {
					window.setTimeout(() => handler(e), 500);

					// When width value wasn't changed after firing orientationchange, then call handler again after 300ms.
					return false;
				}
			}

			rotateTimer && window.clearTimeout(rotateTimer);
			rotateTimer = window.setTimeout(() => triggerRotate(e), 300);
		}

		return undefined;
	}

	return {
		/**
		 * Bind rotate event
		 * @param {Function} listener listener function
		 */
		on(listener) {
			if (typeof(listener) !== "function") {
				return;
			}

			beforeVertical = isVertical();
			beforeScreenWidth = document.documentElement.clientWidth;
			USER_LISTENERS.push(listener);

			// only attach once
			USER_LISTENERS.length === 1 &&
				window.addEventListener(ORIENTATION_CHANGE_EVENT, handler);
		},

		/**
		 * Unbind rotate event
		 * Without param, will unbind all binded listeners
		 * @param {Function} [listener] listener function
		 */
		off(listener) {
			if (typeof(listener) === "function") {
				// remove given listener from list
				for (let i = 0, el; (el = USER_LISTENERS[i]); i++) {
					if (el === listener) {
						USER_LISTENERS.splice(i, 1);
						break;
					}
				}
			}

			// detach when the condition is met
			if (!listener || USER_LISTENERS.length === 0) {
				USER_LISTENERS.splice(0);
				window.removeEventListener(ORIENTATION_CHANGE_EVENT, handler);
			}
		},

		orientationChange: ORIENTATION_CHANGE_EVENT,
		isVertical,
		triggerRotate,
		handler
	};
})();
