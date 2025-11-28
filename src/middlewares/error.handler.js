export function erroHandler ( err, req, res, next ){
    console.error( "[ERROR]", err );
    //Errores mongoose
    if(err?.code === 1100 ) return res.status(409).json({ error: "Email duplicado" });
    if(err?.code === "ValidationError") return res.status(400).json({ error: err.message });
    res.status(500).json({ error: "internal_error" });
}