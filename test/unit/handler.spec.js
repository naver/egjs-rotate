/**
 * Copyright (c) 2015 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import tutils from "./assets/utils";

describe("rotate: handler", function() {
	let fakeWindow;
	let fakeDocument;
	let mockRotate;
	let clock;

	beforeEach(() => {
		fakeWindow = Object.assign({
			"onorientationchange": "onorientationchange",
			orientation: 0,
			setTimeout: (func, delay) => window.setTimeout(func, delay),
			clearTimeout: id => window.clearTimeout(id),
			addEventListener: () => {},
			removeEventListener: () => {}
		}, tutils.ua.ios);

		fakeDocument = {
			documentElement: {
				clientWidth: 200,
				clientHeight: 100
			}
		};

		clock = sinon.useFakeTimers(Date.now());
	});

	afterEach(() => {
		mockRotate && mockRotate.off();
	});

	it("Check info object when rotate event fire.", () => {
		let isVertical;
		mockRotate = tutils.getMock(fakeWindow, fakeDocument);
		const spy = sinon.spy((e, info) => {
			isVertical = info.isVertical;
		});

		mockRotate.on(spy);

		// When
		fakeWindow.orientation = 90;
		mockRotate.handler({
			type: "orientationchange"
		});
		clock.tick(310);

		expect(spy.called).to.be.true;
		expect(isVertical.constructor).to.equal(Boolean);
	});

	it("iOS: If event is orientationchange then trigger", () => {
		mockRotate = tutils.getMock(fakeWindow, fakeDocument);
		const spy = sinon.spy((e, info) => {
			isVertical = info.isVertical;
		});

		mockRotate.on(spy);

		let isVertical = mockRotate.isVertical();

		mockRotate.handler({
			type: "orientationchange"
		});
		clock.tick(310);

		// Then
		expect(isVertical).to.be.ok;

		// When
		fakeWindow.orientation = 90;

		mockRotate.handler({
			type: "orientationchange"
		});
		clock.tick(310);

		// Then
		expect(spy.called).to.be.true;
		expect(isVertical).to.be.false;
	});

	it("Android 4: If event is orientationchange then trigger", () =>  {
		let isVertical = false;

		Object.assign(fakeWindow, tutils.ua.android4);

		mockRotate = tutils.getMock(fakeWindow, fakeDocument);
		const spy = sinon.spy((e, info) => {
			isVertical = info.isVertical;
		});

		mockRotate.on(spy);

		// When
		let checkFail = mockRotate.handler({
			type: "orientationchange"
		});
		clock.tick(310);

		// Then
		expect(checkFail).to.be.false;
		expect(spy.called).to.be.false;
		expect(isVertical).to.be.false;

		// Given
		fakeDocument.documentElement.clientWidth =  100;
		fakeDocument.documentElement.clientHeight =  200;
		fakeWindow.orientation =  90;

		// When
		clock.tick(510);

		checkFail = mockRotate.handler({
			type: "orientationchange"
		});
		clock.tick(310);

		// Then
		expect(spy.called).to.be.true;
		expect(isVertical).to.be.false;
	});

	it("If event is resize then trigger", () =>  {
		let isVertical = false;

		Object.assign(fakeWindow, tutils.ua.android);

		delete fakeWindow.onorientationchange;
		fakeWindow.resize = "resize";

		mockRotate = tutils.getMock(fakeWindow, fakeDocument);
		const spy = sinon.spy((e, info) => {
			isVertical = info.isVertical;
		});

		mockRotate.on(spy);

		fakeDocument.documentElement.clientWidth =  100;
		fakeDocument.documentElement.clientHeight =  200;

		// When
		mockRotate.handler({
			type: "resize"
		});
		clock.tick(10);

		expect(spy.called).to.be.true;
		expect(isVertical).to.be.true;

		// When
		fakeDocument.documentElement.clientWidth =  200;
		fakeDocument.documentElement.clientHeight =  100;

		mockRotate.handler({
			type: "resize"
		});
		clock.tick(10);

		// Then
		expect(spy.called).to.be.true;
		expect(isVertical).to.be.false;
	});

	it("orientationChange : mac(PC) ", () => {
		// Given
		Object.assign(fakeWindow, {
			navigator: {
				userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/600.3.18 (KHTML, like Gecko) Version/8.0.3 Safari/600.3.18"
			}
		});

		mockRotate = tutils.getMock(fakeWindow, fakeDocument);

		// Invocation of rotate in mac Browser returns null
		expect(mockRotate).to.be.undefined;

		// When
		Object.assign(fakeWindow, {
			navigator: {
				userAgent: "Mozilla/5.0 (Windows NT 6.1; WOW64; APCPMS=^N20120502090046254556C65BBCE3E22DEE3F_28573^; Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; InfoPath.3; TCO_20161104143520; rv:11.0) like Gecko"
			}
		});

		mockRotate = tutils.getMock(fakeWindow, fakeDocument);

		// Invocation of rotate in windows Browser returns null
		expect(mockRotate).to.be.undefined;
	});
});
