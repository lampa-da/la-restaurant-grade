import Fuse from 'fuse.js'

const gradeGetter = (score)=> {
  let grade = ''
  if (score === null){
    grade = 'NA'
  }
  else if(score > 89 && score < 101){
    grade = 'A'
  }
  else if(score > 79 && score < 90){
    grade = 'B'
  }
  else if(score > 69 && score < 80){
    grade = 'C'
  }
  return grade
}

function GetElementsByExactClassName(someclass) {
  var i, length, elementlist, data = [];

  // Get the list from the browser
  elementlist = document.getElementsByClassName(someclass);
  if (!elementlist || !(length = elementlist.length))
    return [];

  // Limit by elements with that specific class name only
  for (i = 0; i < length; i++) {
    if (elementlist[i].className == someclass)
      data.push(elementlist[i]);
  }
  // Return the result
  return data;
} 

//Get title fro tooltips
const getTitle=(grade)=> {
  if(grade === 'A'){
    return "GRADE A: The restaurant is clean, up to code, and free of violations"
  }
  else if(grade === 'B'){
    return "GRADE B: The restaurant has some issues that must be fixed"
  }
  else if(grade === 'C'){
    return "GRADE C: The restaurant is a public risk and on verge of closure"
  }    
    return "GRADE PENDING: There is no data about this restaurant in database"
}

//inject HTML Element
const init = function(grade){
  const host = GetElementsByExactClassName('restaurantInfo-container--redesign u-flex u-flex-justify-xs--left')
  const injectionEle = document.createElement('div')
  injectionEle.className = 'grade'
  injectionEle.innerHTML = `
  <img style="margin-right: 5px"
   src=${chrome.extension.getURL(`./img/grade-${grade}.png`)} 
   title='${getTitle(grade)}' />`
  console.log("host", host)
  host ? host[0].appendChild(injectionEle) : ''
}

chrome.runtime.onMessage.addListener((msg, sender, response)=>{
  // console.log('msg',msg)
  if(msg.command == 'singlePage'){
    let restData  = msg.data
    console.log('restData',restData)
    const fetchReq1 = fetch(
      'https://data.lacounty.gov/resource/6ni6-h5kp.json?facility_name='+restData.facility_name+'&$$app_token=JvrAiDKLf9NSEMqBiRG4WbsXW')
      .then((res) => res.json())
      
    const fetchReq2 = fetch(
      'https://data.lacounty.gov/resource/6ni6-h5kp.json?facility_address='+restData.facility_address+'&$$app_token=JvrAiDKLf9NSEMqBiRG4WbsXW'
    ).then((res) => res.json());
    
    const allData = Promise.all([fetchReq1, fetchReq2]);

    allData.then((res) => {
      let restByNameData = res[0]
      let restByAddressData = res[1]
      console.log("restByNameData",restByNameData)
      console.log("restByAddressData",restByAddressData)
      const restaurants = restByNameData
      const fuse = new Fuse(restaurants,  {
        includeMatches: true,
        keys: [
          "facility_address",
        ]
      });
      const pattern = restData.facility_address
      const result = fuse.search(pattern);
      console.log("result", result)

      let restWithLastActivityDate = result.filter(e => (String(new Date(e.item.activity_date)) === String(new Date(Math.max(...result.map(e => new Date(e.item.activity_date)))))));
      console.log('restWithLastActivityDate', restWithLastActivityDate)

      let score = restWithLastActivityDate.length ? restWithLastActivityDate[0].item.score : null
      console.log('score', score)
      let grade = gradeGetter(score)
      console.log("grade", grade)
      init(grade)
    });
  }
  return true
})




// $("#display").append('<img src="/templates/image.gif" alt="red" width="30" height="30" />');
// $("#display").append('<img src="/templates/image.gif alt="red" width="30" height="30" " />');

