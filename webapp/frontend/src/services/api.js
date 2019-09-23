import { httpService, HttpService } from './http.js'
import moment from 'moment';

class ApiService {

    constructor () {
        this.httpService = httpService
        this.stations = []
    }

    // 列車検索
    async getTrains (condition) {
        var date = new Date(condition.year, condition.month - 1, condition.day)

        var params = {
          use_at: moment(date).toISOString(),
          from: condition.from_station,
          to: condition.to_station,
          train_class: condition.train_class,
          adult: condition.adult,
          child: condition.child
        }
        return await this.httpService.get('/api/train/search', {"params": params})
    }

    //座席検索
    async getSeats (condition) {
      var date = new Date(condition.year, condition.month - 1, condition.day)

      var params = {
        date: moment(date).toISOString(),
        from: condition.from_station,
        to: condition.to_station,
        train_class: condition.train_class,
        train_name: condition.train_name,
        car_number: condition.car_number,
      }
      return await this.httpService.get('/api/train/seats', {"params": params})
    }

    async getStations () {
      var self = this
      if (this.stations.length > 0){
        console.log("using cache")
        return this.stations
      }
      return await this.httpService.get('/api/stations').then(function(stations){
        self.stations = stations
        return self.stations
      });
    }

    getStation(id) {
      var ret = {"name": ""}
      this.stations.forEach(function(value){
        if(value.id == id){
          ret = value
        }
      })
      return ret
    }

    async register(data) {
      return await this.httpService.post('/api/auth/signup', data).then(function(res){
        return res
      });
    }

    async login(data) {
      return await this.httpService.post('/api/auth/login', data).then(function(res){
        return res
      });
    }

    async reserve(condition) {
      var date = new Date(condition.year, condition.month - 1, condition.day)
      var request = {
        date: moment(date).toISOString(),
        train_class: condition.train_class,
        train_name: condition.train_name,
        car_number: condition.car_number,
        seat_class: condition.seat_class,
        departure: condition.from_station,
        arrival: condition.to_station,
        child: condition.child,
        adult: condition.adult,
        type: "",
        seats: condition.seats,
      }

      return await this.httpService.post('/api/train/reservation', request).then(function(resp){
        return resp
      });
    }

    async tokenizeCard (data) {
      var data = {
        card_information:data,
      }

      /*
      data =
      {
          card_number: "12345678",
          cvv: "123",
          expiry_date: "12/22"
      }
      */

      return await this.httpService.get('/api/settings').then(function(res){
        var paymentService = new HttpService(res.payment_api)
        return paymentService.post('/card', data).then(function(res){
          return res
        })
      });
    }
}

export const apiService = new ApiService()
