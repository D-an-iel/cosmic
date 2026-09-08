import addressService from '../services/addressService.js';

class AddressController {
  async create(req, res, next) {
    try {
      const address = await addressService.createAddress(req.user.id, req.body);
      res.status(201).json({
        success: true,
        data: address,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const addresses = await addressService.getUserAddresses(req.user.id);
      res.status(200).json({
        success: true,
        data: addresses,
      });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const address = await addressService.getAddressById(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        data: address,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const address = await addressService.updateAddress(req.params.id, req.user.id, req.body);
      res.status(200).json({
        success: true,
        data: address,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await addressService.deleteAddress(req.params.id, req.user.id);
      res.status(200).json({
        success: true,
        message: 'Address deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AddressController();
