import styles from './style.module.css';
export default function Button(prop){ 
    const {children , onClick} = prop;
    return (  
    <button onClick={onClick}> 
          {prop.children}
        </button>
)
}