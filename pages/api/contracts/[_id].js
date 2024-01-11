import Contrato from '../../../models/Contrato'

export default async function handler(req,res){

  try {
    const IDContracts = await Contrato.find({idCliente: req.query._id}).sort({createdAt: -1})
    res.status(200).json(IDContracts.length > 0 ? IDContracts : "El ")
  } catch(error) {
    return res.status(400).json({ msg: error.message });
  }
}