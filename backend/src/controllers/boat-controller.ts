import { BoatService } from "../services/boat-service";
import { Boat } from "../models/Boat";
import express from "express";

export class BoatController {
    constructor(private boatService: BoatService = new BoatService()) {}
    public async getBoats(req: express.Request, res: express.Response): Promise<void>{
        try {
            let result = await this.boatService.returnAllBoats();
            res.status(200).json(result);
        } catch {
            console.error();
            res.status(500).json({"error" : "Something went wrong!"});
        }
    }

    public async addBoat(req: express.Request, res:express.Response):Promise<void> {
        const name: string = req.body.name;
        const price: number = +req.body.price;
        const skipperNeeded: boolean = req.body.skipperNeeded;
        const photo: Blob | undefined | null = <Blob>req.body.photo;
        const length: number = +req.body.length;
        const maxSpeed: number = +req.body.maxSpeed;
        const sailOrMotor: "sail" | "motor" = req.body.sailOrMotor;
        try {
            const result = await Boat.create({name, price, skipperNeeded, photo, length, maxSpeed, sailOrMotor}); 
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).send(makeArrayOfErrorMessages(error));
        }
    }
}

export function makeArrayOfErrorMessages(error: any): Array<string>{
    const errors = error.errors;
        let arrayOfErrorMessages = [];
        for (const error of errors) {
            arrayOfErrorMessages.push(error.message);
        }
        return arrayOfErrorMessages;
    }