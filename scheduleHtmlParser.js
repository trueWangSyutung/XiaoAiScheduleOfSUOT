function scheduleHtmlParser(html) {
    //除函数名外都可编辑
    //传入的参数为上一步函数获取到的html
    //可使用正则匹配
    //可使用解析dom匹配，工具内置了$，跟jquery使用方法一样，直接用就可以了，参考：https://juejin.im/post/5ea131f76fb9a03c8122d6b9
    //以下为示例，您可以完全重写或在此基础上更改、
    console.info(html);
    let result = [];
    let resultT = [];
    //上课时间
    const regexT = /<th width="70" height="28" align="center">.*?第.*?节 <br\/>(.*?)-(.*?) .*?<\/th>/gm;
    let timeFlag = 0;
    while ((t = regexT.exec(html)) !== null) {
        if (t.index === regexT.lastIndex) {
            regexT.lastIndex++;
        }
        let reT = {}
        t.forEach((matchT, groupIndexT) => {
            console.log("matchT: "+matchT)
            switch(groupIndexT){
                case 1:
                    reT.section = ++timeFlag;
                    reT.startTime = matchT;
                    let hour1 = parseInt(matchT.split(':')[0]);
                    let minute1 = parseInt(matchT.split(':')[1]);
                    if( (minute1+45)>=60 ){
                        minute1 = minute1+45-60;
                        hour1++;
                    }else{
                        minute1 += 45;
                    }
                    reT.endTime = ((hour1<10)?"0":"")+hour1+":"+minute1;
                    resultT.push(reT);
                    reT = {}
                    console.log(timeFlag+"1")
                    break;
                case 2:
                    reT.section = ++timeFlag;
                    reT.endTime = matchT;
                    let hour2 = parseInt(matchT.split(':')[0]);
                    let minute2 = parseInt(matchT.split(':')[1]);
                    if( (minute2-45)<0 ){
                        minute2 = minute2-45+60;
                        hour2--;
                    }else{
                        minute2 -= 45;
                    }
                    reT.startTime = ((hour2<10)?"0":"")+hour2+":"+minute2;
                    resultT.push(reT);
                    reT = {}
                    console.log(timeFlag+"2")
                    break;
            }
        });
    }

    //课程
    const regex = /kbcontent1.*?<div id=".*?-(.*?)-2".*?style="display: none;" class="kbcontent".*?>(.*?)<\/div>/gm;
    var log;
    while ((m = regex.exec(html)) !== null) {
        log = "";
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        var weekDay;
        m.forEach((match, groupIndex) => {

            switch(groupIndex){
                case 1:
                    weekDay = parseInt(match)
                    break;
                case 2:
                    //log += ("\n内容："+match);
                    const regexS = /(.*?)<br\/><font title='老师'>(.*?)<\/font><br\/><font title='周次\(节次\)'>(.*?)\(周\)\[(.*?)节\]<\/font><br\/><font title='教室'>(.*?)<\/font><br\/>/gm;
                    while ((mm = regexS.exec(match)) !== null) {
                        if (mm.index === regexS.lastIndex) {
                            regex.lastIndex++;
                        }

                        let re = { sections: [], weeks: [] }
                        mm.forEach((matchS, groupIndexS) => {
                            switch(groupIndexS){
                                case 1:
                                    console.info("星期"+weekDay)
                                    re.day = weekDay;
                                    matchS = matchS.replace("---------------------<br>","")
                                    matchS = matchS.replace("<br/>","")
                                    console.info("   课程名："+matchS+"\n");
                                    re.name = matchS;
                                    break;
                                case 2:
                                    console.info("   老师："+matchS+"\n");
                                    re.teacher = matchS;
                                    break;
                                case 3:
                                    console.info("   周次："+matchS+"\n");
                                    console.info(matchS.split(','))
                                    if (matchS.search(',')!==-1){
                                        let c = matchS.split(',')
                                        for (let i = 0;i<c.length;i++){
                                            let p = c[i]
                                            if(p.search('-') !== -1){ //如果不止一周
                                                let begin = p.split('-')[0];
                                                let end = p.split('-')[1];
                                                for(let iii = parseInt(begin);iii<=parseInt(end);iii++){
                                                    re.weeks.push(iii);
                                                }
                                            }else{ //只有一周
                                                re.weeks.push(parseInt(p))
                                            }
                                        }
                                    }else{
                                        if(matchS.search('-') !== -1){ //如果不止一周
                                            let begin = matchS.split('-')[0];
                                            let end = matchS.split('-')[1];
                                            for(let iii = parseInt(begin);iii<=parseInt(end);iii++){
                                                re.weeks.push(iii);
                                            }
                                        }else{ //只有一周
                                            re.weeks.push(parseInt(matchS))
                                        }
                                    }


                                    break;
                                case 4:
                                    console.info("   节次："+matchS+"\n");
                                    if(matchS.search('-') != -1){ //如果不止一节
                                        let begin2 = matchS.split('-')[0];
                                        let end2 = matchS.split('-')[1];
                                        for(let iii2 = parseInt(begin2);iii2<=parseInt(end2);iii2++){
                                            let ree = {}
                                            ree.section = iii2;
                                            re.sections.push(ree);
                                        }
                                    }else{ //只有一节
                                        let ree2 = {}
                                        ree2.section = parseInt(matchS);
                                        re.sections.push(ree2)
                                    }
                                    break;
                                case 5:
                                    console.info("   教室："+matchS+"\n");
                                    re.position = matchS;
                                    break;
                            }
                        });
                        result.push(re);
                    }
                    //console.log(log);
                    break;
            }
        });
    }


    console.info(resultT)
    console.info(result)
    for (let i=0;i<result.length;i++){
        let t = result[i]
        const  ccc = /(.*?)<span ><font color='red'>&nbspP<\/font><\/span>/gm
        let mmm =ccc.exec(t.name)
        console.info(mmm)
        if (mmm!=null){
            t.name = mmm[1]
        }
    }
    return { courseInfos: result, sectionTimes: resultT}
}
