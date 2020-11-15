import {bcryptAsync,bcryptCheckAsync} from "../utils/bcrypt-async-helper"

interface IGameUser {name: string, userName: string, password: string, role: string}

const users: Array<IGameUser> = [
    {
        name:"Peter Nielsen",
        userName:"pn@mail.dk",
        password:"this is a very strong password",
        role:"basicUser"
    },
    {
        name:"Karl Petersen",
        userName:"kp@mail.dk",
        password:"this is a very strong password",
        role:"basicUser"
    }
]
export default class UserFacade {
    static async addUser(user: IGameUser): boolean {
        const hash = await bcryptAsync(user.password)
        user.password = hash
        user.role = "basicUser"
        users.push(user)
        return users.includes(user)     
    }

    static deleteUser(userName: string): boolean {
        const index = users.findIndex(u => u.userName === userName)
        if(index >= 0) {
            users.splice(index, 1)
            return true;
        } else {
            return false;
        }
    }

    static getAllUsers() : Array<IGameUser> {
        return users
    }

    static getUser(userName: string): IGameUser {
        const user = users.find(u => u.userName === userName)
        if(user) return user
        else throw Error("User could not be found") 
    }

    static async checkUser(userName: string, password: string): boolean {
        try {
            let user: IGameUser | undefined;
            user = await UserFacade.getUser(userName);
            return bcryptCheckAsync(password, user.password);
        } catch (err) {
            return new Promise((resolve,reject) => resolve(false))
        }
    }
}