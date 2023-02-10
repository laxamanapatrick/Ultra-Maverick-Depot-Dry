import axios from 'axios';
import { decodeUser } from './decode-user';

const user = decodeUser()


// Local Backend

export default axios.create({
    baseURL: "https://localhost:44342/api/",
    headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer '+user?.token
    },
})


// Aldryn Vega Backend

// export default axios.create({
//     baseURL: "https://10.10.12.115:5001/api/",
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": 'Bearer '+user?.token
//     }
// })


//Live Depot Version

// export default axios.create({
//     baseURL: "http://10.10.2.6:8002/api/",
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": 'Bearer '+user?.token
//     }
// })
