const axios = require("axios")
const crypto = require("crypto")
const qs = require("qs")
const fs = require("fs")

const YoudaoURL = "http://openapi.youdao.com/api"
const YoudaoVoiceURL = "http://dict.youdao.com/dictvoice"
const YoudaoAppId = process.env.YOUDAO_APP_ID
const YoudaoAppKey = process.env.YOUDAO_APP_KEY


// q=hello&from=en&to=zh-CHS&appKey=7cd3a26ec2b48833&salt=d29e1d49-814d-4659-a465-3a6872b548c2&curtime=1570931254&signType=v3&sign=test

const cache = {}


module.exports = {
    explain: function(q) {
        return new Promise((resolve, reject)=>{

            if (cache[q] !== undefined) {
                resolve(cache[q])
                return
            }
    
            var curTime = Math.round(new Date().getTime()/1000);
            var salt = (new Date).getTime();
        
            var rawSig = YoudaoAppId + truncate(q) + salt + curTime + YoudaoAppKey;

            // query YouDao
            console.log("query YouDao", rawSig)
            axios.post(YoudaoURL, qs.stringify({
                q: q,
                from: "en",
                to: "zh-CHS",
                appKey: "7cd3a26ec2b48833",
                salt: salt,
                curtime: curTime,
                signType: "v3",
                sign: crypto.createHash('SHA256').update(rawSig).digest('hex'),
            })).then((res)=>{
                if (res.data.basic !== undefined) {
                    downloadVoice(q).then(()=>{
                        let info = {
                            "us-phonetic": res.data.basic["us-phonetic"],
                            "uk-phonetic": res.data.basic["uk-phonetic"],
                            "wfs": res.data.basic["wfs"],
                            "explains": res.data.basic["explains"],
                        }
                        cache[q] = info
                        resolve(info);
                    }).catch(reject)
                } else {
                    reject(new Error("word now exists"))
                }
            })
        })
    },
}

function truncate(q){
    var len = q.length;
    if(len<=20) return q;
    return q.substring(0, 10) + len + q.substring(len-10, len);
}

// http://dict.youdao.com/dictvoice?audio=characteristics
function downloadVoice(word) {
    return new Promise((resolve) => {
        axios({
            method:'get',
            url:YoudaoVoiceURL,
            params: {audio: word},
            responseType:'stream'
        })
        .then(function(response) {
            response.data.pipe(fs.createWriteStream(`./voices/${word}.mp3`))
            resolve()
        });
    })
}