import { MapsInterface } from "@/interface/Maps.interface";
import Vue from "vue";
import API from "../api/API";

interface Value {
  mapsList: MapsInterface[]
}

class MapsService {
  value: Value = {
    mapsList: [] 
  }

  setMapList(newList: MapsInterface[]) {
    this.value.mapsList = newList
  }

  async fetchMapList() {
    try {
      const mapsList = await API.fetchAllMapsList()
      
      if (mapsList) {
        this.setMapList(mapsList)
      }
    } catch (error) {
      console.log(error)
      
    }
  }
}

const singletonInstance = new MapsService();

export default singletonInstance