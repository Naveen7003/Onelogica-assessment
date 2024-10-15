//this code has an callback function and has another function with a promise if promise resolved then
// req, res, next will be follow otherwise catch.next will be followed

exports.catchAsyncErrors = (func) => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
}