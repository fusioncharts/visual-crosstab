/* global document */
/* global chai */
/* global describe */
/* global it */
var data =
    {
       "chart": {
            "caption": "This is common Caption",
            "subCaption": "Fusioncharts",
            "chartTopMargin":"10",
            "chartLeftMargin":"100",
            "chartRightMargin":"100",
            "captionAlignment":'left'
        },
        "data" : [{}]
    },
    commonCaption;

commonCaption = new FusionCharts({
    type: 'caption',
    renderAt: document.body,
    width: '400',
    height: '300',
    dataFormat: 'json',
    dataSource: data
});

commonCaption.render();

expect = chai.expect;

describe('chart type caption', function () {
    it('chart type should be Caption or this test will fail', function () {

        var type = commonCaption.chartType(),
            isMatch = (type.toLowerCase() == 'caption');

        expect(isMatch).to
            .equal(true);
    });
    it('caption string should match or this test will fail', function () {
        var caption = commonCaption.apiInstance.config.caption,
            isMatch = (caption == 'This is common Caption');

        expect(isMatch).to
            .equal(true);
    });
    it('subcaption top must not overlap or this test will fail', function () {
        var subCaptionY = commonCaption.apiInstance.components.subCaption.config.y,
            isMatch = (subCaptionY === 28);

        expect(isMatch).to
            .equal(true);
    });
     it('caption and subcaption margin right should be as desired or this test will fail', function () {
        var leftMargin = commonCaption.apiInstance.config.marginLeft,
            isMatch = (leftMargin === 100);

        expect(isMatch).to
            .equal(true);
    });
});
