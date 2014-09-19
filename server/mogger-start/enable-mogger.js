var GLOBAL_PADDING_SIZE = 20;
/**
 * MOGGER on Server
 * ---------------------------------------
 * FIXME: send this code to Mogger itself
 * TODO: colors on the server
 */
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

    var Mogger = Meteor.npmRequire('mogger');

    mogger = new Mogger({
        surrogateTargets: [
            { title: 'Todos', target: Todos },
            { title: 'M.method_handlers', target: Meteor.server.method_handlers },
            { title: 'M.Collect.proto', target: Meteor.Collection.prototype },
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
        showPause: false,
        pointcut: /^[^_]./,
    });

    mogger.traceObj({ before: { message: 'Todos:' }, targetTitle: 'Todos' });
    mogger.traceObj({ before: { message: 'M.method_handlers:' },  targetTitle: 'M.method_handlers' });
    mogger.traceObj({ before: { message: 'M.Collect.proto:' },  targetTitle: 'M.Collect.proto' });
};

