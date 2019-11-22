import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {User} from '../models';
import {UserRepository} from '../repositories';
import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  // host: 'mail.nuevesolutions.com',
  // port: 465,
  // secure: true,
  // auth: {
  //   user: 'surya@nuevesolutions.com',
  //   pass: 'Surya@3220',
  // },
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'jaswathjacobthanos@gmail.com',
    pass: 'jaswanth@hulk',
  },
});

export class StayserviceController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {}

  @post('/users', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<object> {
    // this.userRepository.find(filter);
    const emailP: string = user.email;
    const dd = this.find(user);
    let count = 0;
    await dd.then(user => {
      const reUser = user;
      reUser.forEach(itUer => {
        console.log(itUer.email, '  ---  ', emailP);
        if (itUer.email === emailP) {
          count = count + 1;
          return;
        }
        // if (count > 1) break;
      });
    });
    if (count === 0) {
      this.userRepository.create(user);
      return {message: 'user created succesfully', status: 'success'};
    } else {
      return {message: 'user already exist', status: 'failed'};
    }
  }
  @post('/users/login', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async login(
    @requestBody({
      contnt: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<object> {
    let count = 0;
    const userdd = this.userRepository.find({where: {email: user.email}});
    await userdd.then(users => {
      if (users.length && users[0].password === user.password) {
        count++;
      }
    });

    if (count > 0) {
      return {
        message: 'Login successful',
        status: 'success',
      };
    } else {
      return {
        status: 'failed',
        message: 'User Not Registered',
      };
    }
  }
  @post('/users/forget', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async forget(
    @requestBody({
      contnt: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<object> {
    const res: any = {};
    const otp: string | number = Math.floor(1000 + Math.random() * 9000);
    const forget = await this.userRepository.find({where: {email: user.email}});

    const users: User[] = forget;
    if (users.length > 0) {
      const mailOptions = {
        from: 'info@staytune.com',
        to: user.email,
        subject: 'Email Verification from Staytune',
        html:
          'Hello ' +
          user.fullname +
          ' The otp to verify your email address is ' +
          otp +
          '<br>',
      };

      transporter.sendMail(mailOptions);
      console.log('res', res);

      return res;
    } else {
      return {
        message: 'email not send ',
        status: 'failed',
      };
    }
    // await forget.then(users => {
    //   if (users.length === 0) {
    //     count = 0;
    //     // return;
    //   }

    // });

    // console.log('counter', count);
    // if (count > 0) {
    //   const mailOptions = {
    //     from: 'info@staytune.com',
    //     to: user.email,
    //     subject: 'Email Verification from Staytune',
    //     html:
    //       'Hello ' +
    //       user.fullname +
    //       ' The otp to verify your email address is ' +
    //       otp +
    //       '<br>',
    //   };

    //   transporter.sendMail(mailOptions, (err: any, info: any) => {
    //     if (err) {
    //       console.log('error', err);
    //     } else {
    //       console.log(info);
    //       console.log('Email Sent sucessfully');
    //     }
    //   });

    //   return {
    //     message: true,
    //   };
    // } else {
    //   return {
    //     message: 'emial not send ',
    //     status: 'failed',
    //   };
    // }
  }

  async sendEmail(mailOptions: any) {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log('error', err);
        return {err};
      } else {
        console.log(info);
        console.log('Email Sent sucessfully');
        return info;
      }
    });
  }
  @get('/users/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(User))
    filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @patch('/users', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.query.object('where', getWhereSchemaFor(User)) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  @patch('/users/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
