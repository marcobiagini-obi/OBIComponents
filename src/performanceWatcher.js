export default class Perform {

    static measure(action, title = "") {
        let time1 = performance.now();
        let response = action.call();
        let time2 = performance.now();
        let difference = time2 - time1;
        console.info(`PERFORMANCE ${title} - executed in ${difference / 1000}s`);
        return response;
    }

}