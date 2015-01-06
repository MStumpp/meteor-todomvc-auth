var GLOBAL_PADDING_SIZE = 18;

var multiplyChar = function multiplyChar(char, times) {
    var finalStr = [];
    for (var i = 0; i < times; i++) {
        finalStr.push(char);
    }
    return finalStr.join('');
};

var transforByType = function transforByType(parameter) {
    if(_.isString(parameter)){
        return '\'' + parameter + '\'';
    }
    else if(_.isArray(parameter)){
        if(parameter.length === 0){
            return '[]';
        }

        var finalArray = [];
        finalArray.push('[');

        for (var i = 0; i < parameter.length; i++) {
            finalArray.push(transforByType(parameter[i]));
            if(i !== parameter.length - 1){
                finalArray.push(', ');
            }
        }

        finalArray.push(']');
        return finalArray.join('');
    }
    else if(_.isObject(parameter)){
        var padding = '\n' + multiplyChar(' ', GLOBAL_PADDING_SIZE);
        return JSON.stringify(parameter, ' ', 4).replace(/\n/gi, padding);
    }
    else if(_.isFunction(parameter)){
        return parameter + '()';
    }
    else{
        return parameter;
    }
};

var interceptParameters = function(info) {
    if(info.args.length === 0){
        return info.method + '()';
    }

    var finalString = [];
    finalString.push(info.method);
    finalString.push('(');

    for (var i = 0; i < info.args.length; i++) {
        var arg = info.args[i];
        finalString.push(transforByType(arg));
        if(i !== info.args.length-1){
            finalString.push(', ');
        }
    }

    finalString.push(')');

    return finalString.join('');
};

enableMogger = function() {
    /**
     * instantiate mogger
     * add the surrogateTargets array.
     */

    var GLOBAL_CSS = [
                        'font-size: 14px;' +
                        ''
                     ].join();

    mogger = new Mogger({
        surrogateTargets: [
            { title: 'Todos', target: Todos },
            { title: 'Session', target: Session },
            { title: 'Template.main', target: Template.main },
            { title: 'Template.todo', target: Template.todo },
            { title: 'Template.footer', target: Template.footer },
        ],
        globalBeforeConfig: {
            size: GLOBAL_PADDING_SIZE
        },
        globalInterceptors: [
            {
                filterRegex: /./,
                callback: interceptParameters
            }
        ],
        showArguments: true,
        pointcut: /^[^_]./,
    });

    /**
     * tracing all methods from simple_obj_1
     */
    mogger.traceObj({
        localBeforeConfig: { css: GLOBAL_CSS + 'color: #277' },
        before: { message: 'Todos:' }, targetTitle: 'Todos'
    });

    mogger.traceObj({
        localBeforeConfig: { css: GLOBAL_CSS + 'color: #727' },
        before: { message: 'Session:' }, targetTitle: 'Session'
    });

    mogger.traceObj({
        localBeforeConfig: { css: GLOBAL_CSS + 'color: #274' },
        before: { message: 'T.main:' }, targetTitle: 'Template.main'
    });

    mogger.traceObj({
        localBeforeConfig: { css: GLOBAL_CSS + 'color: #2B4' },
        before: { message: 'T.todo:' }, targetTitle: 'Template.todo'
    });

    mogger.traceObj({
        localBeforeConfig: { css: GLOBAL_CSS + 'color: #204' },
        before: { message: 'T.footer:' }, targetTitle: 'Template.footer'
    });

};
