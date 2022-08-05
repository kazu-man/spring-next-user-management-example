

export const InputField = ({name,type,error,setValue,value,className=""}) =>{

    return (
        <>

            <div className="my-2">
                <label className={`block text-gray-600 text-sm font-normal capitalize`}>
                    {name}
                </label>
                <input name={name} type={type} value={value} className={`h-10 w-96 border mt-2 px-2 py-2 ${error ? "border-red-500" : ""} ${className ? className : ""}`} onChange={(e) => setValue([name],e.target.value)}></input>
                {
                    error &&
                    <div className="text-red-500 whitespace-pre-wrap text-sm">{error}</div>
                }
            </div>
        </>
    )
}