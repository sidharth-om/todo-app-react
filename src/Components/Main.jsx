import {useState,useEffect} from "react";

const Main = () => {
    let [note,setNote]= useState("");
    let [notes,setNotes]=useState([]);

    function handleAddNote(){
        if(!note){
            alert("Text Not Found")
            return;
        }
        console.log(Date.now());
        
        let newNote = {id : Date.now(),note : note}
        setNotes([...notes,newNote])
        setNote("")
        // let stringArr = JSON.stringify(notes)
        // localStorage.setItem('note',stringArr)
        
        
    }

    const handleDelete = (id)=>{
        console.log(id);
        
        let newNotes = notes.filter((obj)=> obj.id !== id)
        let stringArr = JSON.stringify(newNotes)
        localStorage.setItem('note',stringArr)
        setNotes(newNotes)
        
    }

    useEffect(() => {
        if(notes.length !== 0){
            localStorage.setItem('note', JSON.stringify(notes));
        }
    }, [notes]);
    
    // useEffect(() => {
        
    // setNotes(JSON.parse(localStorage.getItem('note')))
    
    // }, []);

useEffect(() => {
  const saved = localStorage.getItem('note');
  if (saved) {
    try {
      setNotes(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to parse notes from localStorage", e);
      setNotes([]);           // or just leave it empty
    }
  }
  // else → do nothing, notes stays []
}, []);

  return (
    <div className="w-[100%] h-[88vh] flex justify-center flex-col items-center">
      <div className="w-[60%] h-[20%] gap-2 flex items-center">
        <input
          className="w-[80%] pl-[15px] h-[50px] rounded-md border-[#dadada] border-[2px] border-solid"
          value={note}
          onChange={(e)=>setNote(e.target.value)}
          type="text"
        />
        <button onClick={handleAddNote} className="w-[20%] h-[50px] bg-green-500 rounded-md text-[1.3rem] font-semibold text-white">
          Add
        </button>
      </div>

      <div className="w-[60%] h-[80%] overflow-y-scroll">

            {
                notes.map((obj,i)=>{
                  return(  <div key={i} className="w-[100%] flex p-[10px] mb-2 rounded-md bg-[#efefef]">
                    <div className="w-[80%] ">
                      <h1 className="text-[1.1rem]">{obj.note}</h1>
                    </div>
                    <div className="w-[20%] flex gap-2 ">
                      <button onClick={()=>handleDelete(obj.id)} className="w-[70%] h-[40px] rounded-md bg-red-500 text-white text-[1.1rem] font-semibold">
                        Delete
                      </button>
                    </div>
                  </div>)
                })
            }

       


      </div>
    </div>
  );
};

export default Main;