import styles from './style.module.css';
export default function InputTag(prop) { 
    const {placeholder="default"} = prop;
    return ( 
        <input className={styles.container} placeholder={placeholder} /> 
    )
}