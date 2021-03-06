import * as chai from 'chai';
import { temporaryDir, shell, pkg, exists, exec, read, shellAsync } from '../helpers';

const expect = chai.expect;
const tmp = temporaryDir();

describe('CLI simple generation - extends app', () => {
    let stdoutString = undefined;

    let appComponentFile, myInitialClassFile;

    const distFolder = tmp.name + '-big-app-extends';

    before(done => {
        tmp.create(distFolder);
        let ls = shell('node', [
            './bin/index-cli.js',
            '-p',
            './test/src/sample-files-extends/src/tsconfig.json',
            '-d',
            distFolder
        ]);

        if (ls.stderr.toString() !== '') {
            console.error(`shell error: ${ls.stderr.toString()}`);
            done('error');
        }
        stdoutString = ls.stdout.toString();
        appComponentFile = read(`${distFolder}/components/AppComponent.html`);
        myInitialClassFile = read(`${distFolder}/classes/MyInitialClass.html`);
        done();
    });
    after(() => tmp.clean(distFolder));

    it('AppComponent extends AnotherComponent', () => {
        expect(appComponentFile).to.contain('myprop');
        expect(appComponentFile).to.contain('ngOnInit');
        expect(appComponentFile).to.contain('myoutput');
        expect(appComponentFile).to.contain('itisme');
    });

    it('MyInitialClass extends SubClassA', () => {
        expect(myInitialClassFile).to.contain('meh');
        expect(myInitialClassFile).to.contain('myproperty');
    });
});
