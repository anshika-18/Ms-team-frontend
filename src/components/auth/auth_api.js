export const login=async(data)=>{
    const response=await fetch('http://localhost:5000/api/auth/login',{
        method:'POST',
        headers:{
            'Accept':'application/json',
            'Content-type':'application/json'
        },
        body:JSON.stringify({data})
    })
    const res=await response.json();
    return res;
}