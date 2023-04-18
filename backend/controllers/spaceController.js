const Space = require("../models/spaceSchema");
const User = require("../models/userSchema");

/*
 * @desc GET spaces
 * @route GET /spaces
 * @access Private
 * */
const getSpaces = async (req, res) => {
  //Find returns a cursor(empty array or always truthy)
  const spaces = await Space.find({ owner: req.user._id }).select(
    "spaceId spaceName createdAt"
  );
  res.status(200).send(spaces);
};

/*
 * @desc Create spaces
 * @route POST /spaces
 * @access Private
 * */
const createSpaces = async (req, res) => {
  try {
    if (!req.body.spaceId || !req.body.spaceName) {
      throw new Error("One or more fields missing");
    }

    const spaceData = [
      {
        fileName: "Untitled-1",
        fileData: "",
        fileLang: "javascript",
      },
    ];

    const space = new Space({
      spaceId: req.body.spaceId,
      spaceName: req.body.spaceName,
      owner: req.user._id,
      spaceData,
    });

    await space.save();

    const spaces = await Space.find({ owner: req.user._id }).select(
      "spaceId spaceName createdAt"
    );

    res.status(200).send(spaces);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

/*
 * @desc Get data of a particular space
 * @route GET /spaces/:id
 * @access Private
 * */
const getSpaceData = async (req, res) => {
  try {
    const space = await Space.findOne({
      owner: req.user._id,
      spaceId: req.params.id,
    }).select("-_id -__v -updatedAt -createdAt");
    if (!space) {
      throw new Error("No space found with this ID!");
    }

    res.status(200).send(space);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

/*
 * @desc Update spaces
 * @route PUT /spaces/:id
 * @access Private
 * */
const updateSpaceData = async (req, res) => {
  try {
    const updatedSpace = await Space.findOneAndUpdate(
      { owner: req.user._id, spaceId: req.params.id },
      { $set: req.body },
      { new: true }
    ).select("-owner -_id -__v -updatedAt");
    res.status(201).json("Saved!");
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

/*
 * @desc Delete spaces
 * @route DELETE /api/spaces/:id
 * @access Private
 * */
const deleteSpace = async (req, res) => {
  try {
    const space = await Space.findOne({
      owner: req.user._id,
      spaceId: req.params.id,
    });
    if (!space) {
      throw new Error("No space found with this spaceId!");
    }

    await space.remove();

    const spaces = await Space.find({ owner: req.user._id }).select(
      "spaceId spaceName createdAt"
    );

    res.status(201).send(spaces);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

module.exports = {
  getSpaces,
  createSpaces,
  updateSpaceData,
  deleteSpace,
  getSpaceData,
};
