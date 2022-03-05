import  {GetElementsByExactClassName} from "./index"

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
    if(!activeTab.url){
      console.log('this is not Grubhub')
      chrome.tabs.sendMessage(activeTab.id, {command: "notGrubhub", data: data})
    }
    else{
      console.log('this is Grubhub')
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


chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (tab.status == 'complete' 
    && tab.title !== "Prepare your taste buds..." 
    && tab.title !== "Food Delivery | Restaurant Takeout | Order Food Online | Grubhub") {
    console.log("tab", tab)
    createCommandObject()
  }
})




