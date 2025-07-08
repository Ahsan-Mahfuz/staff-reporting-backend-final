import { Request, Response, NextFunction } from 'express'
import { CompanyModel } from './company.model'
import { companySchema } from './company.validation'

export const createCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { color } = req.body

    const isValidHex = !color || /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(color)

    if (!isValidHex) {
      res.status(400).json({
        message: 'Color must be a valid hex code',
        error: 'Bad Request',
      })
      return
    }

    const logoImagePath = req.file
      ? `/picture/company_image/${req.file.filename}`
      : undefined

    const createdBy = (req as any).user?.userId
    if (!createdBy) {
      res.status(401).json({ message: 'Unauthorized Access' })
      return
    }

    const existingCompany = await CompanyModel.findOne({ createdBy })

    if (existingCompany) {
      if (color !== undefined && color !== '') {
        existingCompany.color = color
      }
      if (logoImagePath) {
        existingCompany.logoImage = logoImagePath
      }

      await existingCompany.save()
      res.status(200).json({
        message: 'Company details updated successfully',
        data: existingCompany,
      })
      return
    }

    const company = await CompanyModel.create({
      color: color || undefined,
      logoImage: logoImagePath,
      createdBy,
    })

    res.status(201).json({
      message: 'Company details updated successfully',
      data: company,
    })
  } catch (error) {
    next(error)
  }
}

export const getCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).user?.userId

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized Access' })
      return
    }

    const company = await CompanyModel.findOne({ createdBy: userId })

    if (!company) {
      res
        .status(404)
        .json({
          message:
            'Company details not found. Please create company details first.',
        })
      return
    }

    res.status(200).json({
      message: 'Company details fetched successfully',
      data: company,
    })
  } catch (error) {
    next(error)
  }
}
