
function getNameFromTitle(title){
  return title.split(' Delivery Menu |')[0].toUpperCase()
}

function getAddressFromTitle(title){
  return title.split('| Order Online | ')[1].split(' | Grubhub')[0].toUpperCase()
}

function createCommandObject(){
  console.log('im in')
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
    let activeTab = tabs[0]
    console.log("activeTab", activeTab)
    let pageTitle = activeTab.title 
    let data = {}
    if(pageTitle ===  "Search Results"){
      console.log('main page')
    }
    else{
      console.log('other pages')
      let facility_name = getNameFromTitle(pageTitle)
      let facility_address = getAddressFromTitle(pageTitle)
      console.log('name', facility_name)
      console.log('address', facility_address)
      data.facility_name = facility_name
      data.facility_address = facility_address
      chrome.tabs.sendMessage(activeTab.id, {command: "singlePage", data: data})
    }
    console.log('activeTab, pageTitle',activeTab, pageTitle)
  })
}

// document.querySelector('.get-command').addEventListener('click', function(){
//   createCommandObject()
// })
const el = document.querySelector('.get-command')
if(el){
el.addEventListener('click', function(){
  createCommandObject()
})
}



// chrome.tab.onUpdated.addEventListener(function(tabId, changeInfo, tab){
//   console.log('111111111')
//   if(changeInfo.url){
//     console.log('222222222')
//     createCommandObject()
//     console.log('333333333')
//     chrome.tabs.executeScript({
//       file: 'contentScript.js'
//     })
//   }
// })

