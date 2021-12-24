import { mapper } from '../../../utils/Mapper';
import * as PatchUtil from  '../../../utils/PatchUtil';

class Origin {
    id: number = 1;
    name: string = 'Hello';
    personAge: number = 30;
    createdAt: string = "2020-01-01 20:22:22"
}

class UpdateModel {
    name: string = 'Zur';
    personAge: number = 100;
}

mapper.createMap(Origin, UpdateModel);

it('prepares update', () => {
    const origin = new Origin();
    const updated = new UpdateModel();

    const patch = PatchUtil.prepare(origin, updated);
    
    expect(patch.length).toBe(2);
    expect(patch.find((item) => item.op == 'replace' && item.path == '/person_age' && item.value == 100)).not.toBe(null);
    expect(patch.find((item) => item.op == 'replace' && item.path == '/name' && item.value == 'Zur')).not.toBe(null);
});