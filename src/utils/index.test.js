const rewire = require("rewire")
const index = rewire("./index")
const verifyMinified = index.__get__("verifyMinified")
// @ponicode
describe("verifyMinified", () => {
    test("0", () => {
        let callFunction = () => {
            verifyMinified()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("index.default.removeOutmostQuotation", () => {
    test("0", () => {
        let callFunction = () => {
            index.default.removeOutmostQuotation("http://placeimg.com/640/480")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            index.default.removeOutmostQuotation("“”")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            index.default.removeOutmostQuotation("”http://placeimg.com/640/480")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            index.default.removeOutmostQuotation("”")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            index.default.removeOutmostQuotation("http://placeimg.com/640/480“””http://placeimg.com/640/480")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            index.default.removeOutmostQuotation(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
