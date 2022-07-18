/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSONSchemaType } from 'ajv';
import { expect } from 'chai';
import { Request, Response } from 'express';
import sinon from 'sinon';
import { SinonSpy } from 'sinon';
import { Middleware } from '../../src/middleware';
import { Validator } from '../../src/util/validator';

describe('Test validator', () => {
  type TestData = {
    id: number;
    string: string;
    bool: boolean;
    date: string;
  };

  const TEST_SCHEMA: JSONSchemaType<TestData> = {
    type: 'object',
    properties: {
      id: {
        type: 'number',
      },
      string: {
        type: 'string',
      },
      bool: {
        type: 'boolean',
      },
      date: {
        type: 'string',
        format: 'date',
      },
    },
    required: ['id', 'string', 'date'],
    additionalProperties: false,
  };

  const validator = new Validator(TEST_SCHEMA);

  describe('Imperative version', () => {
    it('should return true when all properties are present and correct', () => {
      const payload = {
        id: 1,
        string: 'string',
        bool: false,
        date: '2022-08-05',
      };

      expect(validator.validate(payload)).to.be.true;
      expect(validator.errors).to.equal(null);
    });

    it('should generate an error when not all properties are present', () => {
      const payload = {
        string: 'string',
        bool: false,
        date: '2022-08-05',
      };

      const expectedErrors = [
        {
          instancePath: '',
          schemaPath: '#/required',
          keyword: 'required',
          params: { missingProperty: 'id' },
          message: "must have required property 'id'",
        },
      ];

      expect(validator.validate(payload)).to.be.false;
      expect(validator.errors).to.deep.equal(expectedErrors);
    });

    it('should generate an error when not all properties are correct', () => {
      const payload = {
        id: '1',
        string: 'string',
        bool: false,
        date: '2022-08-05',
      };

      const expectedErrors = [
        {
          instancePath: '/id',
          schemaPath: '#/properties/id/type',
          keyword: 'type',
          params: { type: 'number' },
          message: 'must be number',
        },
      ];

      expect(validator.validate(payload)).to.be.false;
      expect(validator.errors).to.deep.equal(expectedErrors);
    });
  });

  describe('Middleware version', () => {
    let middleware: Middleware;
    let req: any;
    let res: MockResponse;
    let nextSpy: SinonSpy;

    class MockResponse {
      private _status?: number;

      private _json?: string;

      public status(code: number): MockResponse {
        this._status = code;
        return this;
      }

      public json(object: unknown): MockResponse {
        this._json = JSON.stringify(object);
        return this;
      }

      public get statusCode(): number | undefined {
        return this._status;
      }

      public get jsonString(): any {
        return this._json;
      }
    }

    beforeEach(() => {
      middleware = validator.middleware();
      req = {};
      res = new MockResponse();
      nextSpy = sinon.spy();
    });

    afterEach(() => {
      sinon.restore();
    });

    it('should be a middleware', () => {
      expect(middleware).to.be.a('Function');
      expect(middleware.length).to.equal(3);
    });

    it('should call next when all properties are present and correct', () => {
      const payload = {
        id: 1,
        string: 'string',
        bool: false,
        date: '2022-08-05',
      };

      req.body = payload;

      middleware(
        req as unknown as Request,
        res as unknown as Response,
        nextSpy
      );

      expect(nextSpy.callCount).to.equal(1);
    });

    it('should respond with an error when not all properties are present', () => {
      const payload = {
        string: 'string',
        bool: false,
        date: '2022-08-05',
      };

      req.body = payload;

      middleware(
        req as unknown as Request,
        res as unknown as Response,
        nextSpy
      );

      expect(nextSpy.callCount).to.equal(0);
      expect(res.statusCode).to.equal(400);
      expect(JSON.parse(res.jsonString)[0].message).to.contain(
        "must have required property 'id'"
      );
    });

    it('should respond with an error when not all properties are correct', () => {
      const payload = {
        id: '1',
        string: 'string',
        bool: false,
        date: '2022-08-05',
      };

      req.body = payload;

      middleware(
        req as unknown as Request,
        res as unknown as Response,
        nextSpy
      );

      expect(nextSpy.callCount).to.equal(0);
      expect(res.statusCode).to.equal(400);
      expect(JSON.parse(res.jsonString)[0].message).to.contain(
        'must be number'
      );
    });
  });
});
