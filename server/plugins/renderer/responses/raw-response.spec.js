'use strict';

const RawResponse = require('./raw-response');
const Utils = require('../../../lib/utils');

describe('RawResponse', () => {
    const data = new Buffer('<html><head></head><body>hello</body></html>');

    const headers = {
        'content-type': 'html/text',
    };

    const statusCode = 200;
    let request;
    let response;
    let h;

    beforeEach(() => {
        request = {
            url: {},
            path: '/',
            app: {themeConfig: {variationIndex: 1}},
        };

        response = {
            code: () => response,
            header: jest.fn(),
        };

        h = {
            response: jest.fn().mockReturnValue(response),
        };
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('respond()', () => {
        it('should respond', () => {
            const rawResponse = new RawResponse(data, headers, statusCode);

            rawResponse.respond(request, h);

            expect(h.response).toHaveBeenCalled();
        });

        it('should append checkout css if is the checkout page', () => {
            request.path = '/checkout.php?blah=blah';
            const rawResponse = new RawResponse(data, headers, statusCode);
            const expectedCss = `<link href="/stencil/${Utils.int2uuid(1)}/${Utils.int2uuid(2)}/css/checkout.css"`;

            rawResponse.respond(request, h);

            expect(h.response).toHaveBeenCalledWith(expect.stringContaining(expectedCss));
        });

        it('should not append transfer-encoding header', () => {
            const rawResponse = new RawResponse(data, headers, statusCode);

            rawResponse.respond(request, h);

            expect(response.header).not.toHaveBeenCalledWith('transfer-encoding');
            expect(response.header.mock.calls[0]).toContain('content-type');
        });
    });
});
