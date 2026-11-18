"use strict"
/*
 * 2.3.2: on MongoDB 7 the connection never succeeded. TypeORM sent the index options it had no
 * value for (sparse, background) as null, MongoDB refused the index ("not convertible to bool"),
 * and ReForgeGiveaways retried for ever. The indexes are now created after connecting.
 * Runs only against MongoDB (GIVEAWAYS_TEST_DB with "type":"mongodb", see the CI job); skipped
 * otherwise. Fails on 2.3.1: the boot times out.
 */
const { test, before, after } = require("node:test")
const assert = require("node:assert/strict")
const fs = require("fs")
const os = require("os")
const path = require("path")

const options = process.env.GIVEAWAYS_TEST_DB ? JSON.parse(process.env.GIVEAWAYS_TEST_DB) : {}
const skip = options.type !== "mongodb" && "needs GIVEAWAYS_TEST_DB with type mongodb"

let h
before(async () => {
    if (skip) return
    const { boot } = require("./fixtures/harness")
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error("could not connect to MongoDB within 30 s")), 30_000).unref())
    h = await Promise.race([boot(fs.mkdtempSync(path.join(os.tmpdir(), "fg-mongo-"))), timeout])
})
after(async () => { await h?.close() })

test("connects to MongoDB and creates the giveaway indexes, id unique", { skip }, async () => {
    const { Database } = require("..")
    assert.equal(Database.driverName, "mongodb")
    const indexes = await Database.db.mongoManager.collectionIndexInformation(Database.schema, { full: true })
    const byName = Object.fromEntries(indexes.map((i) => [i.name, i]))
    assert.deepEqual(byName.IDX_giveaway_message?.key, { messageID: 1 })
    assert.deepEqual(byName.IDX_giveaway_guild_ended?.key, { guildID: 1, hasEnded: 1 })
    assert.deepEqual(byName.IDX_giveaway_id?.key, { id: 1 })
    assert.equal(byName.IDX_giveaway_id.unique, true)
})
