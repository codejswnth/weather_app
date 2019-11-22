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
import {Client} from '../models';
import {ClientRepository} from '../repositories';
const authy = require('authy')('DUYY88gnE3Ph3XPpZMzrwqsScoTJQDQp');

export class ClientController {
  constructor(
    @repository(ClientRepository)
    public clientRepository: ClientRepository,
  ) {}

  @post('/clients', {
    responses: {
      '200': {
        description: 'Client model instance',
        content: {'application/json': {schema: getModelSchemaRef(Client)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {
            title: 'NewClient',
            exclude: ['id'],
          }),
        },
      },
    })
    client: Omit<Client, 'id'>,
  ): Promise<Object> {
    console.log('client', client);
    let count = 0;

    const email: any = client.email;
    const dd = this.clientRepository.find({where: {email: email}});
    await dd.then((c: any) => {
      const reClient = c;
      reClient.forEach((itClient: any) => {
        console.log(itClient.email === email);
        if (itClient.email === email) {
          count = count + 1;
          return;
        }
      });
    });
    if (count === 0) {
      this.clientRepository.create(client);
      return {message: 'user created succesfully', status: 'success'};
    } else {
      return {message: 'user already exist', status: 'failed'};
    }
  }

  @post('/client/login', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Client)}},
      },
    },
  })
  async login(
    @requestBody({
      contnt: {
        'application/json': {
          schema: getModelSchemaRef(Client, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<Client, 'id'>,
  ): Promise<object> {
    let count = 0;
    const clientdd = this.clientRepository.find({where: {email: user.email}});
    await clientdd.then(client => {
      if (client.length && client[0].password === user.password) {
        count++;
      }
    });
    if (count > 0) {
      return {
        message: 'login successful',
        status: 'success',
      };
    } else {
      return {
        status: 'failed',
        message: 'user not registered',
      };
    }
  }

  @post('/client/forget', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Client)}},
      },
    },
  })
  async forget(
    @requestBody({
      contnt: {
        'application/json': {
          schema: getModelSchemaRef(Client, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<Client, 'id'>,
  ): Promise<object> {
    let count = 0;
    const forget = this.clientRepository.find({where: {number: user.number}});
    await forget.then(users => {
      if (users.length === 0) {
        count = 0;
        return;
      }
      if (users[0].number === user.number && users.length > 0) {
        count++;
        return;
      }
    });
    if (count > 0) {
      // const authy = require('authy')('DUYY88gnE3Ph3XPpZMzrwqsScoTJQDQp');
      authy
        .phones()
        .verification_start(
          user.number,
          '+91',
          {via: 'sms', locale: 'en', code_length: '6'},
          (err: any) => {
            if (err) {
              console.log(err);
            }
          },
        );
      return {
        message: 'number found',
        status: 'success',
      };
    } else {
      return {
        status: 'failed',
        message: 'number not found',
      };
    }
  }

  @post('/client/validateOtp', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Client)}},
      },
    },
  })
  async vaidateOtp(
    @requestBody({
      contnt: {
        'application/json': {
          schema: getModelSchemaRef(Client, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<Client, 'id'>,
  ): Promise<object> {
    return this.clientRepository.create(user);
  }

  @get('/clients/count', {
    responses: {
      '200': {
        description: 'Client model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Client))
    where?: Where<Client>,
  ): Promise<Count> {
    return this.clientRepository.count(where);
  }

  @get('/clients', {
    responses: {
      '200': {
        description: 'Array of Client model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Client)},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Client))
    filter?: Filter<Client>,
  ): Promise<Client[]> {
    return this.clientRepository.find(filter);
  }

  @patch('/clients', {
    responses: {
      '200': {
        description: 'Client PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {partial: true}),
        },
      },
    })
    client: Client,
    @param.query.object('where', getWhereSchemaFor(Client))
    where?: Where<Client>,
  ): Promise<Count> {
    return this.clientRepository.updateAll(client, where);
  }

  @get('/clients/{id}', {
    responses: {
      '200': {
        description: 'Client model instance',
        content: {'application/json': {schema: getModelSchemaRef(Client)}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Client> {
    return this.clientRepository.findById(id);
  }

  @patch('/clients/{id}', {
    responses: {
      '204': {
        description: 'Client PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Client, {partial: true}),
        },
      },
    })
    client: Client,
  ): Promise<void> {
    await this.clientRepository.updateById(id, client);
  }

  @put('/clients/{id}', {
    responses: {
      '204': {
        description: 'Client PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() client: Client,
  ): Promise<void> {
    await this.clientRepository.replaceById(id, client);
  }

  @del('/clients/{id}', {
    responses: {
      '204': {
        description: 'Client DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.clientRepository.deleteById(id);
  }
}
