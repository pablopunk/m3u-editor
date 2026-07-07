import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

const root = new URL("../../", import.meta.url);

function readJson(relativePath) {
    return JSON.parse(readFileSync(new URL(relativePath, root), "utf8"));
}

test("project has the expected frontend test entrypoint", () => {
    const pkg = readJson("package.json");

    assert.equal(pkg.type, "module");
    assert.equal(pkg.scripts?.build, "vite build");
    assert.equal(pkg.scripts?.dev, "vite");
    assert.match(pkg.scripts?.test ?? "", /^node --test tests\/node/);
});

test("vite config is present and wired for the Laravel app", () => {
    const viteConfig = readFileSync(new URL("vite.config.js", root), "utf8");

    assert.match(viteConfig, /laravel-vite-plugin/);
    assert.match(viteConfig, /resources\/js\/app\.js/);
    assert.match(viteConfig, /resources\/css\/app\.css/);
});
