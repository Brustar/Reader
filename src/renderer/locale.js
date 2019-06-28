export const i18n = {
    locale:process.env.LC_CTYPE.match('(.+)\\.')[1],
    signMix:function(str){
      console.dir(arguments)
      for(var i = 0; i < arguments.length; i++)
            str = str.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i+1]);
        return str;
    },
    'zh_CN': require('../lang/zh'),
    'en_US': require('../lang/en')
}
