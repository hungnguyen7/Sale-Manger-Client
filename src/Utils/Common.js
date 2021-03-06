import axios from 'axios';
// export const getUser=()=>{
//     const userStr=sessionStorage.getItem('user');
//     if(userStr) return JSON.parse(userStr);
//     else return null;
// }

export const getToken=()=>{
    return sessionStorage.getItem('token')||null;
}

// export const removeUserSession=()=>{
//     sessionStorage.removeItem('token');
//     sessionStorage.removeItem('user');
// }

// export const setUserSession=(token, user)=>{
//     // console.log(token, user)
//     sessionStorage.setItem('token', token);
//     // tự động logout sau 3 tiếng
//     setTimeout(()=>removeUserSession(), 1000*60*60*3)
// }

export const postDataToServer=async (link, data)=>{
    await axios.post(process.env.REACT_APP_API_URL+link,data).then(res=>{
        console.log(res)
    }).catch(error=>{
        alert(error.response.data.message)
    })
}
export const patchDataToServer=async (link ,data)=>{
    await axios.patch(process.env.REACT_APP_API_URL+link, data).then(res=>{
        console.log(res)
    }).catch(error=>{
        console.log(error)
    })
}
export const getDataFromServer=async(link)=>{
    let data = await axios.get(process.env.REACT_APP_API_URL+link).then(res=>{
        return res;
    }).catch(error=>
        console.log(error)
        )
    return data
}
export const deleteDataFromServer=async (link)=>{
    await axios.delete(process.env.REACT_APP_API_URL+link).then(res=>{
        // console.log(res)
    }).catch(error=>{
        console.log(error)
    })
}
export const putDataToServer=async (link ,data)=>{
    await axios.put(process.env.REACT_APP_API_URL+link, data).then(res=>{
        console.log(res)
    }).catch(error=>{
        console.log(error)
    })
}
export const numberWithCommas=x=> {
    if(!x)
        return 0
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }