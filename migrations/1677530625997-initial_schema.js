const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class initialSchema1677530625997 {
    name = 'initialSchema1677530625997'

    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying, "email" character varying NOT NULL, "phoneNumber" character varying, "password" character varying, "firstName" character varying, "lastName" character varying, "accountNumber" character varying, "isVerified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber"), CONSTRAINT "UQ_cc09a77e7c732ac84c7d4c1c82e" UNIQUE ("accountNumber"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."plan_frequencyofsavings_enum" AS ENUM('daily', 'weekly', 'monthly')`);
        await queryRunner.query(`CREATE TYPE "public"."plan_duration_enum" AS ENUM('3', '6', '12')`);
        await queryRunner.query(`CREATE TABLE "plan" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "numberOfBuddies" integer NOT NULL, "hasTarget" boolean NOT NULL, "autoDebit" boolean NOT NULL, "frequencyOfSavings" "public"."plan_frequencyofsavings_enum" NOT NULL, "startDate" TIMESTAMP NOT NULL, "endDate" TIMESTAMP NOT NULL, "creator" character varying NOT NULL, "duration" "public"."plan_duration_enum" NOT NULL, "isSubscriptionOpen" boolean NOT NULL DEFAULT true, "status" character varying NOT NULL DEFAULT 'inactive', "targetSavingsAmount" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b715b5d883580fc638fef048f90" UNIQUE ("title"), CONSTRAINT "PK_54a2b686aed3b637654bf7ddbb3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."otp_status_enum" AS ENUM('idle', 'used', 'expired')`);
        await queryRunner.query(`CREATE TABLE "otp" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "email" character varying NOT NULL, "status" "public"."otp_status_enum" NOT NULL DEFAULT 'idle', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f6f87548102f5848e26035bde04" UNIQUE ("code"), CONSTRAINT "PK_32556d9d7b22031d7d0e1fd6723" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_plans_plan" ("userId" integer NOT NULL, "planId" integer NOT NULL, CONSTRAINT "PK_a6f31be3c199c71cdd8da560970" PRIMARY KEY ("userId", "planId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_34cca65608052ed88abaad3439" ON "user_plans_plan" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ef97615f822b58a320964369dd" ON "user_plans_plan" ("planId") `);
        await queryRunner.query(`ALTER TABLE "user_plans_plan" ADD CONSTRAINT "FK_34cca65608052ed88abaad3439f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_plans_plan" ADD CONSTRAINT "FK_ef97615f822b58a320964369dd0" FOREIGN KEY ("planId") REFERENCES "plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_plans_plan" DROP CONSTRAINT "FK_ef97615f822b58a320964369dd0"`);
        await queryRunner.query(`ALTER TABLE "user_plans_plan" DROP CONSTRAINT "FK_34cca65608052ed88abaad3439f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ef97615f822b58a320964369dd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_34cca65608052ed88abaad3439"`);
        await queryRunner.query(`DROP TABLE "user_plans_plan"`);
        await queryRunner.query(`DROP TABLE "otp"`);
        await queryRunner.query(`DROP TYPE "public"."otp_status_enum"`);
        await queryRunner.query(`DROP TABLE "plan"`);
        await queryRunner.query(`DROP TYPE "public"."plan_duration_enum"`);
        await queryRunner.query(`DROP TYPE "public"."plan_frequencyofsavings_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
}
