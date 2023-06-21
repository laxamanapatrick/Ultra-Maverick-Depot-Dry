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


// Backend Local

// export default axios.create({
//     baseURL: "http://10.10.10.1:45455/api/",
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

// Azure Version

// export default axios.create({
//     baseURL: "https://ultramaverickdry.azurewebsites.net/api/",
//     headers: {
//         "Content-Type": "application/json",
//         "Authorization": 'Bearer '+user?.token
//     }
// })