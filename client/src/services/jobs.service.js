const API_URL = "http://localhost:5000/api/v1";
export async function getJobs (){
    const response = await fetch (`${API_URL}/jobs`);
    if (!resonse.ok){
        throw new Error ("failed to fetch jobs ");

    }
    return response.json();
}
