/**
 * Copyright (c) 2015 NAVER Corp.
 * egjs projects are licensed under the MIT license
 */
import rotateInjector from "inject-loader!../../../src/rotate";

const tutils = {
	ua: {
		android: {
			navigator: {
				userAgent: "Mozilla/5.0 (Linux; U; Android 2.1; en-us; Nexus One Build/ERD62) AppleWebKit/530.17 (KHTML, like Gecko) Version/4.0 Mobile Safari/530.17"
			}
		},
		android4: {
			navigator: {
				userAgent: "Mozilla/5.0 (Linux; U; Android 4.0.4; nl-nl; GT-N8010 Build/IMM76D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30"
			}
		},
		ios: {
			navigator: {
				userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
			}
		}
	},
	getMock(win, doc) {
		const injector = {};

		win && (injector.window = win);
		doc && (injector.document = doc);

		return rotateInjector({
			"./browser": injector
		});
	}
}

export default tutils;
