export const i18n = {
    locale:process.env.LC_CTYPE,
    signMix:function(str){
      console.dir(arguments)
      for(var i = 0; i < arguments.length; i++)
            str = str.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i+1]);
        return str;
    },
    'zh-CN': require('../lang/zh'),
    'en-US': require('../lang/en')
}
