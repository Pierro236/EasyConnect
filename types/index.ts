export interface IPost {
    id: number,
    user_id: number,
    caption: string,
    image: string,
    title: string,
    ingredients: string,
    user?: {
      image: string,
      username: string,
      name: string,
      description: string,
      certified?: boolean,
      id? : number,
    },
    time: number,
    likes: number,
    comments: number,
    liked: boolean,
    saved: boolean,
  }
  
  export interface IUser {
    profile_picture: string,
    username: string,
    name: string,
    description: string,
    certified?: boolean,
    id? : number,
  }