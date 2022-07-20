const ClientModel = require("../models/clientsModel");
const mongoose = require("mongoose");

const createClient = async (req, res) => {
  const client = req.body;
  try {
    if (!client.name)
      return res.status(400).json("Nombre del cliente es necesario");

    if (await checkIfClientWasPreviouslyCreated(client)) {
      return res.status(400).json("Cliente con mismo nombre o email ya existe");
    }

    const createdClient = await ClientModel.create(client);

    return res.status(200).json(createdClient);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const checkIfClientWasPreviouslyCreated = async (client) => {
  const { email, name } = client;
  const queryObj = {
    name: name,
  };
  if (email) {
    queryObj.email = email;
  }

  try {
    const foundClients = await ClientModel.find(queryObj).lean();
    if (foundClients?.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const getClients = async (req, res) => {
  const queryObj = req.query;

  const limit = Number(queryObj.limit) || 20;
  const index = Number(queryObj.index) || 0;

  delete queryObj.limit;
  delete queryObj.index;

  if (queryObj.name) {
    queryObj.name = {
      $regex: queryObj.name,
      $options: "i",
    };
  }

  if (queryObj.email) {
    queryObj.email = {
      $regex: queryObj.email,
      $options: "i",
    };
  }

  try {
    const clients = await ClientModel.find(queryObj)
      .limit(limit)
      .skip(Number(index) * Number(limit))
      .sort({_id: -1})
      .exec();
    const count = await ClientModel.count(queryObj);

    return res.status(200).json({ data: clients, count });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const querySpecificClient = async (req, res) => {
  const {id} = req.params;
  try {
    const client = await ClientModel.findById(id).lean();
    return res.status(200).json({...client});
  } catch (error) {
    return res.status(500).json(error);
  }
}

const editClient = async (req, res) => {
  let { id } = req.params;

  const client = req.body;

  if (!id) return res.status(400).json("Id de cliente es requerido");

  if (!client.name)
    return res.status(400).json("Nombre del cliente es necesario");

  try {
    const editedClient = await ClientModel.findByIdAndUpdate(id, client, { new: true });
    return res.status(200).json(editedClient);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteClient = async (req, res) => {
  const id = req.params.id;
  try {
    const deletedClient = await ClientModel.findByIdAndDelete(id);
    return res.status(200).json(deletedClient);
  } catch(error) {
    return res.status(500).json(error);
  }
}

module.exports = {
  createClient,
  getClients,
  querySpecificClient,
  editClient,
  deleteClient
};
