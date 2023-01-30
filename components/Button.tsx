
interface props {
    btnName:string,
    classStyles:string
    handleClick?: () => void;
}

const Button = ({btnName,classStyles, handleClick} : props) => (
    <button 
        onClick={handleClick}
        type="button"
        className={`nft-gradient text-sm minlg:text-lg py-2 px-6 minlg:px-8 font-poppins font-semibold text-white ${classStyles}`}
    >
        {btnName}
    </button>
)

export default Button
