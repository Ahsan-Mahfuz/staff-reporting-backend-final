import { Request, Response, NextFunction } from 'express'
import { updateOwnStaffSchema } from './staff_profile.validations'
import { StaffModel } from '../staff/staff.model'
import { StaffProfileModel } from './staff_profile.model'
import { UserModel } from '../user/user.model'

export const updateStaffProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const staffId = (req as any).user?.staffId

    if (!staffId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const validatedData = updateOwnStaffSchema.parse(req.body)

    if (
      'staffId' in req.body ||
      'password' in req.body ||
      'rates' in req.body
    ) {
      res.status(400).json({
        message: 'You are not allowed to update staffId, password, or rates.',
      })
      return
    }

    const staffFields: any = {}
    const profileFields: any = {}

    const staffModelFields = [
      'name',
      'designation',
      'phoneNumber',
      'staffImage',
    ]
    const profileModelFields = [
      'trade',
      'location',
      'memberSince',
      'allergies',
      'ongoingHealthConcern',
      'emergencyContactName',
      'emergencyContactNumber',
      'emergencyContactAddress',
      'Qualifications',
    ]
    for (const key in validatedData) {
      const typedKey = key as keyof typeof validatedData

      if (staffModelFields.includes(key)) {
        staffFields[key] = validatedData[typedKey]
      } else if (profileModelFields.includes(key)) {
        profileFields[key] = validatedData[typedKey]
      }
    }
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[]
    }

    if (files.staffImage && files.staffImage[0]) {
      staffFields.staffImage = `/picture/staff_image/${files.staffImage[0].filename}`
    }

    if (files.qualification && files.qualification[0]) {
      profileFields.Qualifications = `/picture/staff_image/${files.qualification[0].filename}`
    }

    const staff = await StaffModel.findOne({ _id: staffId })
    if (!staff) {
      res.status(404).json({ message: 'Staff not found' })
      return
    }

    const updatedStaff = await StaffModel.findByIdAndUpdate(
      staff._id,
      { $set: staffFields },
      { new: true }
    )

    let updatedProfile = await StaffProfileModel.findOne({
      staffRef: staff._id,
    })

    if (updatedProfile) {
      await StaffProfileModel.updateOne(
        { staffRef: staff._id },
        { $set: profileFields }
      )
      updatedProfile = await StaffProfileModel.findOne({ staffRef: staff._id })
    } else {
      updatedProfile = new StaffProfileModel({
        ...profileFields,
        staffRef: staff._id,
      })
      await updatedProfile.save()
    }

    res.status(200).json({
      message: 'Profile updated successfully',
    })
  } catch (err) {
    next(err)
  }
}

export const getAllStaffProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = (req as any).user?.userId
    if (!adminId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const admin = await UserModel.findOne({
      _id: adminId,
    })

    if (!admin) {
      res.status(404).json({ message: 'Admin not found' })
      return
    }

    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page - 1) * limit

    const { search } = req.query

    let filter: any = { createdBy: adminId }

    if (search && typeof search === 'string') {
      const regex = new RegExp(search, 'i')
      filter.$or = [{ name: regex }, { phoneNumber: regex }, { staffId: regex }]
    }

    const totalStaff = await StaffModel.countDocuments(filter)


    const allStaff = await StaffModel.find(filter).skip(skip).limit(limit).lean()

    const allProfiles = await StaffProfileModel.find()
      .populate({
        path: 'staffRef',
        model: StaffModel,
        match: { createdBy: adminId },
      })
      .lean()

    const profileMap = new Map()
    allProfiles.forEach((profile) => {
      if (profile.staffRef) {
        profileMap.set(profile.staffRef._id.toString(), profile)
      }
    })

    res.status(200).json({
      message: 'All staff profiles fetched successfully',
      data: allStaff
        .filter((staff) => staff.password)
        .map((staff) => {
          const profile = profileMap.get(staff._id.toString())

          const { password, ...staffWithoutPassword } = staff

          return {
            ...staffWithoutPassword,
            trade: profile?.trade || null,
            location: profile?.location || null,
            memberSince: profile?.memberSince || null,
            allergies: profile?.allergies || null,
            ongoingHealthConcern: profile?.ongoingHealthConcern || null,
            emergencyContactName: profile?.emergencyContactName || null,
            emergencyContactNumber: profile?.emergencyContactNumber || null,
            emergencyContactAddress: profile?.emergencyContactAddress || null,
            Qualifications: profile?.Qualifications || null,
          }
        }),
      pagination: {
        total: totalStaff,
        page,
        limit,
        pages: Math.ceil(totalStaff / limit),
      },
    })
  } catch (err) {
    next(err)
  }
}

export const getSingleStaffProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { staffId } = req.params
    if (!staffId) {
      res.status(400).json({ message: 'Staff ID is required' })
      return
    }

    const adminId = (req as any).user?.userId
    if (!adminId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const admin = await UserModel.findById(adminId)
    if (!admin) {
      res.status(404).json({ message: 'Admin not found' })
      return
    }

    const staff = await StaffModel.findOne({
      _id: staffId,
      createdBy: adminId,
    }).lean()

    if (!staff) {
      res
        .status(404)
        .json({ message: 'Staff not found or does not belong to this admin' })
      return
    }

    const profile = await StaffProfileModel.findOne({
      staffRef: staff._id,
    }).lean()

    res.status(200).json({
      message: 'Staff profile fetched successfully',
      data: {
        _id: staff._id,
        staffId: staff.staffId,
        name: staff.name,
        rates: staff.rates,
        staffImage: staff.staffImage,
        phoneNumber: staff.phoneNumber,
        designation: staff.designation,
        trade: profile?.trade || null,
        location: profile?.location || null,
        memberSince: profile?.memberSince || null,
        allergies: profile?.allergies || null,
        ongoingHealthConcern: profile?.ongoingHealthConcern || null,
        emergencyContactName: profile?.emergencyContactName || null,
        emergencyContactNumber: profile?.emergencyContactNumber || null,
        emergencyContactAddress: profile?.emergencyContactAddress || null,
        Qualifications: profile?.Qualifications || null,
      },
    })
  } catch (err) {
    next(err)
  }
}

export const getMyStaffProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { staffId } = req.params
    if (!staffId) {
      res.status(400).json({ message: 'Staff ID is required' })
      return
    }

    const adminId = (req as any).user?.staffId
    if (adminId !== staffId) {
      res.status(401).json({ message: 'Unauthorized access' })
      return
    }

    const staff = await StaffModel.findOne({
      _id: staffId,
    }).lean()

    if (!staff) {
      res.status(404).json({ message: 'Unauthorized access' })
      return
    }

    const profile = await StaffProfileModel.findOne({
      staffRef: staff._id,
    }).lean()

    res.status(200).json({
      message: 'Profile fetched successfully',
      data: {
        _id: staff._id,
        staffId: staff.staffId,
        name: staff.name,
        rates: staff.rates,
        staffImage: staff.staffImage,
        phoneNumber: staff.phoneNumber,
        designation: staff.designation,
        trade: profile?.trade || null,
        location: profile?.location || null,
        memberSince: profile?.memberSince || null,
        allergies: profile?.allergies || null,
        ongoingHealthConcern: profile?.ongoingHealthConcern || null,
        emergencyContactName: profile?.emergencyContactName || null,
        emergencyContactNumber: profile?.emergencyContactNumber || null,
        emergencyContactAddress: profile?.emergencyContactAddress || null,
        Qualifications: profile?.Qualifications || null,
      },
    })
  } catch (err) {
    next(err)
  }
}
