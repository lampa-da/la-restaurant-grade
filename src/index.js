const FuzzySearch = require('fuzzy-search')
import Fuse from 'fuse.js'


chrome.runtime.onMessage.addListener((msg, sender, response)=>{
  // console.log('msg',msg)
  if(msg.command == 'singlePage'){
    let restData  = msg.data
    console.log('restData',restData)
    const apiKey = "rr6b6je2uzib2eh55g8r6by9"
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
    const searcher = new Fuse(restaurants, ['facility_name'], {
      caseSensitive: true,
    });
    console.log('seacher', seacher);
    const result = searcher.search(`${restData.facility_name}`);
    console.log("result", result)
    });
  }
  return true
})

const init = function(){
  const injectionEle = document.createElement('div')
  injectionEle.className = 'blabla'
  injectionEle.innerHTML = "hello!"
  document.body.appendChild(injectionEle)
}
init
