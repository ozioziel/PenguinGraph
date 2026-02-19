import { useEffect, useState } from "react";
import Menu from './components/Menu'
function App(){
  const [nombre, setNombre] =  useState("escribe algo")
  const [texto, setTexto] = useState("xd")
 

  let n

  useEffect(() => {
    if (nombre == "hola")
    {
      setTexto("hoal")
    }
    
  }, [nombre])

  function saludar(){
    setTexto("hola jajajaj")
  }
  return(


    <div>
      <Menu></Menu>
      <h1 className = "xd"> {texto} </h1>

      <input value = {nombre}
      onChange = {(e) => setNombre(e.target.value)
      }
      />
      <button onClick = {saludar}> hola </button>
    </div>


  )
}
export default App