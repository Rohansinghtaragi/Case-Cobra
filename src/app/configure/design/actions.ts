'use server'
import { db } from '@/db'
import {CaseColor, CaseFinish, CaseMaterial, PhoneModel} from '@prisma/client'

export type SaveConfigProps = {
    configId: string,
    color: CaseColor,
    finish: CaseFinish,
    material: CaseMaterial,
    model: PhoneModel,
}
export async function saveConfig({color, finish, material, model, configId} : SaveConfigProps) {
    await db.configuration.update({
        where: {id: configId},
        data: {
            color, finish, material, model
        }
    })
}