import addressRepository from '../repositories/addressRepository.js';

class AddressService {
  async createAddress(userId, addressData) {
    // If this address is marked as default, we need to handle others
    const isDefault = addressData.isDefault || false;

    const address = await addressRepository.create({
      ...addressData,
      userId,
    });

    if (isDefault) {
      await addressRepository.setUserDefaultAddress(userId, address.id);
    }

    return address;
  }

  async getUserAddresses(userId) {
    return await addressRepository.findByUserId(userId);
  }

  async getAddressById(id, userId) {
    const address = await addressRepository.findByIdAndUser(id, userId);
    if (!address) {
      throw new Error('Address not found or unauthorized');
    }
    return address;
  }

  async updateAddress(id, userId, updateData) {
    const address = await addressRepository.findByIdAndUser(id, userId);
    if (!address) {
      throw new Error('Address not found or unauthorized');
    }

    if (updateData.isDefault === true) {
      await addressRepository.setUserDefaultAddress(userId, id);
      delete updateData.isDefault; // Avoid redundant update in the next call
    }

    return await addressRepository.update(id, updateData);
  }

  async deleteAddress(id, userId) {
    const address = await addressRepository.findByIdAndUser(id, userId);
    if (!address) {
      throw new Error('Address not found or unauthorized');
    }

    return await addressRepository.delete(id);
  }
}

export default new AddressService();
