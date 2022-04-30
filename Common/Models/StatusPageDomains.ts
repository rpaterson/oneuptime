import { Column, Entity } from 'typeorm';
import BaseModel from './BaseModel';
import User from './User';
import StatusPage from './StatusPage';
import DomainVerificationToken from './DomainVerificationToken';

@Entity({
    name: 'StatusPageDomains',
})
export default class StatusPageDomains extends BaseModel {
    @Column()
    public statusPage!: StatusPage;

    @Column()
    public domain!: string;

    @Column()
    public certificate!: User;

    @Column()
    public privateKey!: User;

    @Column()
    public autoProvisioning!: boolean;

    @Column()
    public domainVerificationToken!: DomainVerificationToken;
}
