/**
* Copyright (c) 2015 NAVER Corp.
* egjs projects are licensed under the MIT license
*/
import tutils from "./assets/utils";

describe("rotate", function() {
	describe("orientationChange", () => {
		const fakeDocument = {
			documentElement: {
				clientWidth: 100,
				clientHeight: 200
			}
		};

		it("Check event name on android && 2.1", () => {
			const mockRotate = tutils.getMock(tutils.ua.android, fakeDocument);

			expect(mockRotate.orientationChange).to.be.equal("resize");
		});

		it("window has onorientationchange?", () => {
			const fakeWindow = Object.assign({
				onorientationchange: "onorientationchange"
			}, tutils.ua.ios);

			const mockRotate = tutils.getMock(fakeWindow, fakeDocument);

			expect(mockRotate.orientationChange).to.be.equal("orientationchange");
		});

		it("The window has not onorientationchange?", () => {
			const fakeWindow = Object.assign({
				resize: "resize"
			}, tutils.ua.ios);

			const mockRotate = tutils.getMock(fakeWindow, fakeDocument);

			expect(mockRotate.orientationChange).to.be.equal("resize");
		});
	});

	describe("isVertical", function() {
		it("If event is resize then first time call", () => {
			const fakeWindow = Object.assign({
				resize: "resize"
			}, tutils.ua.android);

			const fakeDocument = {
				documentElement: {
					clientWidth: 100,
					clientHeight: 200
				}
			};

			const mockRotate = tutils.getMock(fakeWindow, fakeDocument);

			expect(mockRotate.isVertical()).to.be.true;
		});

		it("If event is resize then second times call and rotate vertical", () => {
			const fakeWindow = Object.assign({
				resize: "resize"
			}, tutils.ua.android);

			const fakeDocument = {
				"documentElement": {
					"clientWidth": 200,
					"clientHeight": 100
				}
			};

			const mockRotate = tutils.getMock(fakeWindow, fakeDocument);
			mockRotate.isVertical()

			// When
			fakeDocument.documentElement.clientWidth = 100;
			fakeDocument.documentElement.clientHeight = 200;

			expect(mockRotate.isVertical()).to.be.ok;
		});

		it("If event is resize then second times call and stay", () => {
			const fakeWindow = Object.assign({
				resize: "resize"
			}, tutils.ua.android);

			const fakeDocument = {
				documentElement: {
					clientWidth: 100,
					clientHeight: 200
				}
			};

			const mockRotate = tutils.getMock(fakeWindow, fakeDocument);

			// When
			fakeDocument.documentElement.clientWidth = 100;
			fakeDocument.documentElement.clientHeight = 200;

			expect(mockRotate.isVertical()).to.be.true;
		});

		it("If event is resize then second times call and rotate horizontal", () => {
			const fakeWindow = Object.assign({
				resize: "resize"
			}, tutils.ua.android);

			const fakeDocument = {
				documentElement: {
					clientWidth: 100,
					clientHeight: 200
				}
			};

			const mockRotate = tutils.getMock(fakeWindow, fakeDocument);

			// When
			fakeDocument.documentElement.clientWidth = 200;
			fakeDocument.documentElement.clientHeight = 100;

			expect(mockRotate.isVertical()).to.be.false;
		});

		it("If event is 'orientationchange' then vertical. (orientation:0,180)", () =>  {
			const fakeWindow = Object.assign({
				onorientationchange: "onorientationchange",
				orientation: 0
			}, tutils.ua.android);

			const fakeDocument = {
				documentElement: {
					clientWidth: 100,
					clientHeight: 200
				}
			};

			const mockRotate = tutils.getMock(fakeWindow, fakeDocument);

			expect(mockRotate.isVertical()).to.be.true;

			// When
			fakeWindow.orientation = 180;
			expect(mockRotate.isVertical()).to.be.true;
		});

		it("If event is orientationchange then horizontal. (orientation:90,-90)", () => {
			const fakeWindow = Object.assign({
				onorientationchange: "onorientationchange",
				orientation: 90
			}, tutils.ua.ios);

			const fakeDocument = {
				documentElement: {
					clientWidth: 100,
					clientHeight: 200
				}
			};

			const mockRotate = tutils.getMock(fakeWindow, fakeDocument);

			expect(mockRotate.isVertical()).to.be.false;

			// When
			fakeWindow.orientation = -90;
			expect(mockRotate.isVertical()).to.be.false;
		});
	});
});
