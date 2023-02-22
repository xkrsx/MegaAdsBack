import {AdEntity, NewAdEntity, SimpleAdEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {v4 as uuid} from "uuid";
import {FieldPacket} from "mysql2";

type AdRecordResults = [AdEntity[], FieldPacket[]];

export class AdRecord implements AdEntity {
//nie trzeba podawać public, bo jest i tak
    public id: string;
    public name: string;
    public description: string;
    public price: number;
    public url: string;
    public lat: number;
    public lon: number;

    constructor(obj: NewAdEntity) {
        if (!obj.name || obj.name.length > 100) {
            throw new ValidationError('Nazwa ogłoszenia nie może być pusta, ani przekraczać 100 znaków.');
        }

        if (obj.description.length > 1000) {
            throw new ValidationError('Opis ogłoszenia nie może przekraczać 1000 znaków.');
        }

        if (obj.price < 0 || obj.price > 9999999) {
            throw new ValidationError('Cena nie może być mniejsza niż 0, ani przekraczać 9 999 999');
        }

        //@TODO: check if url is valid
        if (!obj.url || obj.url.length > 100) {
            throw new ValidationError('Adres url ogłoszenia nie może być pusty, ani przekraczać 100 znaków.');
        }

        if (typeof obj.lat !== 'number' || typeof obj.lon !== 'number') {
            throw new ValidationError('Nie można zlokalizować ogłoszenia.');
        }

        this.id = obj.id;
        this.name = obj.name;
        this.description = obj.description;
        this.price = obj.price;
        this.url = obj.url;
        this.lat = obj.lat;
        this.lon = obj.lon;
    }

    static async getOne(id: string): Promise<AdRecord | null> {
        const [results] = await pool.execute("SELECT * FROM `ads` WHERE id = :id", {
            id
        }) as AdRecordResults;

        return results.length === 0 ? null : new AdRecord(results[0]);
    }

    async insert(): Promise<string> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new Error('Cannot insert this ad - it already exists.');
        }

        await pool.execute("INSERT INTO `ads` (`id`, `name`, `description`, `price`, `url`, `lat`, `lon`) VALUES (:id, :name, :description, :price, :url, :lat, :lon)", this
            // {
            //     id: this.id,
            //     name: this.name,
            //     description: this.description,
            //     price: this.price,
            //     url: this.url,
            //     lat: this.lat,
            //     lon: this.lon,
            // }
        );

        return this.id;
    }

    static async findAll(name: string): Promise<SimpleAdEntity[]> {
        const [results] = await pool.execute("SELECT * FROM `ads` WHERE `name` LIKE :search", {
            search: `%${name}%`,
        }) as AdRecordResults;

        // return results.map(result => new AdRecord(result));

        return results.map(result => {
            const {
                id, lat, lon,
            } = result;

            return {
                id, lat, lon,
            };
        });
    }
}