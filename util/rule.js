var base_message = {
  required: '这个字段必传',
  maxLength: '这个字段最长{{length}}',
  minLength: '这个字段最短{{length}}',
  email: '邮箱格式不正确',
  phoneNumber: '手机号码不正确',
  number: ''
}

var regexp_box = {
  email: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
  phoneNumber: /^[0-9]{11,11}$/
}

class Rule{
  constructor(rules){
    // rules 参数配置
    /*
        {
            rules: {
                username: {
                    required: true,
                    maxLength: 20,
                    minLength: 10,
                    email: true,
                    phoneNumber: true,
                }
            }
        }
    */
    this.rules = rules
  }

  test(values){

    var callbackJson = {
      pass: true,
      info: {

      }
    }
    for(var i in this.rules.rules){
      var key = i;
      var value = this.rules.rules[i]
      var testValue = values[key] || ''
      if(typeof values[key] == 'number'){
          testValue = values[key]
      }

      var nowInfo = callbackJson.info[key] = callbackJson.info[key] || {}


      if(value.required && this.rule_required(testValue)){
        nowInfo.required = base_message.required
        callbackJson.pass = false

      }

      if(value.maxLength && this.rule_maxLength(testValue, value.maxLength)){
        nowInfo.required = base_message.maxLength.replace('{{length}}', value.maxLength)
        callbackJson.pass = false
      }

      if(value.minLength && this.rule_minLength(testValue, value.minLength)){
        nowInfo.required = base_message.minLength.replace('{{length}}', value.minLength)
        callbackJson.pass = false
      }

      if(value.email && !this.rule_email(testValue)){
        nowInfo.required = base_message.email
        callbackJson.pass = false
      }

      if(value.phoneNumber && !this.rule_phoneNumber(testValue)){
        nowInfo.required = base_message.phoneNumber
        callbackJson.pass = false
      }
    }

    return callbackJson
  }

  rule_required(value){

    if(typeof value == 'number'){
        return false
    }

    var sortValue = (value+'').replace(/\s/g, '')
    return sortValue === '' // true 为空
  }

  rule_maxLength(value, length){
    return value.length > length // true 超过最大长度
  }

  rule_minLength(value, length){
    return value < length // true 小于最低长度
  }

  rule_email(value){
    return regexp_box.email.test(value) // true 测试通过
  }

  rule_phoneNumber(value){
    return regexp_box.phoneNumber.test(value) // true 测试通过
  }
}

module.exports = Rule
